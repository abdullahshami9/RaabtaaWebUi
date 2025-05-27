<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;

class StoreController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->get();
        $categories = Category::all();

        return Inertia::render('Store/Index', [
            'products' => $products,
            'categories' => $categories,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }
} 