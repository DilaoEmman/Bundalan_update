<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\FarewellMessageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public endpoints
Route::get('v1/feedback/stats', [FeedbackController::class, 'stats']);

// --- Public Farewell Message endpoints ---
Route::get('v1/farewell-messages', [FarewellMessageController::class, 'index']);
Route::get('v1/farewell-messages/{id}', [FarewellMessageController::class, 'show']);
Route::get('v1/farewell-messages/random', [FarewellMessageController::class, 'random']);

// Auth routes
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);
    Route::post('register', [AuthController::class, 'register']);
});

// Protected routes
Route::group(['middleware' => 'auth:api'], function () {

    //Customer Management
    Route::group(['prefix' => 'v1/customers'], function () {
        Route::get('/list', [CustomerController::class, 'index']);
        Route::post('/', [CustomerController::class, 'store']);
        Route::get('/{id}', [CustomerController::class, 'show']);
        Route::put('/{id}', [CustomerController::class, 'update']);
        Route::delete('/{id}', [CustomerController::class, 'destroy']);
        Route::post('/getList', [CustomerController::class, 'getList']);
    });

    // Product management
    Route::group(['prefix' => 'v1/products'], function() {
        Route::get('/list', [ProductController::class, 'index']);
        Route::get('/initForm', [ProductController::class, 'initForm']);
        Route::post('/', [ProductController::class, 'store']);
        Route::post('/getList', [ProductController::class, 'getList']);
        Route::get('/{id}', [ProductController::class, 'show']);
        Route::post('/{id}', [ProductController::class, 'update']);
        Route::delete('/{id}', [ProductController::class, 'destroy']);
        Route::post('/getList', [ProductController::class, 'getList']);
    });

    // Order management
    Route::group(['prefix' => 'v1/orders'], function() {
        Route::get('/', [OrderController::class, 'index']);
        Route::get('/list', [OrderController::class, 'index']);
        Route::post('/', [OrderController::class, 'store']);
        Route::get('/{id}', [OrderController::class, 'show']);
    });

    // --- Feedback endpoints (protected) ---
    Route::group(['prefix' => 'v1/feedback'], function() {
        Route::post('/', [FeedbackController::class, 'store']);
        Route::get('/', [FeedbackController::class, 'index']);
    });

    // --- Survey endpoints (protected) ---
    Route::post('/v1/surveys', [SurveyController::class, 'store']);
    Route::get('/v1/surveys', [SurveyController::class, 'index']);

    // --- Farewell Message Management (protected) ---
    Route::group(['prefix' => 'v1/farewell-messages'], function() {
        Route::post('/', [FarewellMessageController::class, 'store']);
        Route::put('/{id}', [FarewellMessageController::class, 'update']);
        Route::delete('/{id}', [FarewellMessageController::class, 'destroy']);
        // Note: GET endpoints are public, see above
    });

    // --- Reporting endpoints, protected by manager/admin role ---
    Route::group(['prefix' => 'v1/reports', 'middleware' => ['role:manager,admin']], function() {
        Route::get('/sales', [OrderController::class, 'reportSales']);
        Route::get('/product-performance', [OrderController::class, 'reportProductPerformance']);
        Route::get('/inventory', [OrderController::class, 'reportInventory']);
    });

    Route::middleware(['role:manager,admin'])->group(function () {
        Route::get('/manager-area', function () {
            return response()->json(['message' => 'Welcome manager or admin!']);
        });
    });

    Route::middleware(['role:cashier'])->group(function () {
        Route::get('/cashier-area', function () {
            return response()->json(['message' => 'Welcome cashier!']);
        });
    });
});
