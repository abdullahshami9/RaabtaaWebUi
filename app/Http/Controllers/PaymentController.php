<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
{
    // Show the payments page
    public function index()
    {
        $payments = Payment::where('user_id', Auth::id())->get();
        return Inertia::render('Payments/Index', [
            'payments' => $payments,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    public function store(Request $request)
    {
        $cleanedData = $request->all();
        $cleanedData['card_number'] = str_replace(' ', '', $cleanedData['card_number']);
        
        $validator = Validator::make($cleanedData, [
            'card_holder_name' => 'required|string|max:255',
            'card_number' => 'required|digits:16',
            'expiry_date' => ['required', 'regex:/^(0[1-9]|1[0-2])\/\d{2}$/'],
            'cvc' => 'required|digits_between:3,4',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Save the payment data (in production, use a payment gateway instead of storing raw data)
            $payment = Payment::create([
                'user_id' => Auth::id(),
                'card_holder_name' => $request->card_holder_name,
                'card_number' => substr($request->card_number, -4), // Store only last 4 digits
                'expiry_date' => $request->expiry_date,
                'cvc' => $request->cvc,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment information saved successfully',
                'data' => $payment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Update an existing payment
    public function update(Request $request, Payment $payment)
    {
        $this->authorize('update', $payment);

        $cleanedData = $request->all();
        $cleanedData['card_number'] = str_replace(' ', '', $cleanedData['card_number']);

        $request->validate([
            'card_holder_name' => 'required|string|max:255',
            'card_number' => 'required|digits:16',
            'expiry_date' => ['required', 'regex:/^(0[1-9]|1[0-2])\/\d{2}$/'],
            'cvc' => 'required|digits_between:3,4',
        ]);

        $payment->update([
            'card_holder_name' => $request->card_holder_name,
            'card_number' => substr($cleanedData['card_number'], -4),
            'expiry_date' => $request->expiry_date,
            'cvc' => $request->cvc,
        ]);

        return redirect()->back()->with('success', 'Payment updated successfully!');
    }

    // Delete a payment
    public function destroy(Payment $payment)
    {
        $this->authorize('delete', $payment);
        $payment->update(['is_deleted' => 1]);
        return redirect()->back()->with('success', 'Payment removed successfully!');
    }
} 