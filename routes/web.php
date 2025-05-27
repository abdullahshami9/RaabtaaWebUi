<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NotesController;
use App\Http\Controllers\ColorController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\SocialLinkController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\RemindersController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Profile Routes
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show'])->name('profile.show');
        Route::get('/edit', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/update', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/delete', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });
    
    // Notes
    Route::get('/notes', [NotesController::class, 'index']);
    Route::post('/notes', [NotesController::class, 'store']);
    Route::patch('/notes/{note}', [NotesController::class, 'update']);
    Route::delete('/notes/{note}', [NotesController::class, 'destroy']);
    
    // Colors
    Route::get('/colors', [ColorController::class, 'index']);
    
    // Social Links
    Route::get('/socials', [SocialLinkController::class, 'showPage'])->name('socials');
    Route::get('/social-links', [SocialLinkController::class, 'index']);
    Route::post('/social-links', [SocialLinkController::class, 'store']);
    Route::patch('/social-links/{socialLink}', [SocialLinkController::class, 'update']);
    Route::delete('/social-links/{socialLink}', [SocialLinkController::class, 'destroy']);
    Route::post('/social-links/reorder', [SocialLinkController::class, 'reorder']);
    
    // New routes
    Route::get('/digital-card', [DashboardController::class, 'digitalCard'])->name('digital-card');
    Route::get('/notifications', [DashboardController::class, 'notifications'])->name('notifications');
    Route::get('/reminders', [DashboardController::class, 'reminders'])->name('reminders');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/payments', [PaymentController::class, 'index'])->name('payments');
    Route::get('/store', [StoreController::class, 'index'])->name('store');
    Route::get('/reminders', [RemindersController::class, 'index'])->name('reminders');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/survey', [SurveyController::class, 'show'])->name('survey');
    Route::post('/survey', [SurveyController::class, 'store'])->name('survey.store');
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::post('/payments', [PaymentController::class, 'store']);
    Route::put('/payments/{payment}', [PaymentController::class, 'update']);
    Route::delete('/payments/{payment}', [PaymentController::class, 'destroy']);
});

require __DIR__.'/auth.php';
