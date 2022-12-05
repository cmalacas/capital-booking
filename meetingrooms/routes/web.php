<?php

use Illuminate\Support\Facades\Route;

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

Auth::routes();

Route::group(['middleware' => 'auth:web'], function() {

    Route::get('/', function () {
        return view('welcome');
    }); 


    Route::get('/checkout/online-payment', 'BookingController@onlinePayment');

    Route::prefix('/dashboard')->group(function() {

        Route::get('/', function () {
            return view('welcome');
        });

        Route::post('/save', 'DashboardController@save');
        Route::get('/{id}/success', 'DashboardController@success');

    });

    Route::get('/meetingrooms', function () {
        return view('welcome');
    });

    Route::get('/bookings', function () {
        return view('welcome');
    });
    
    Route::post('/get-user-data', 'UserController@get');


    Route::prefix('/meetingrooms')->group(function() {

        Route::post('/get', 'MeetingRoomController@get');
        Route::post('/save', 'MeetingRoomController@save');
        Route::post('/update', 'MeetingRoomController@update');
        Route::post('/delete', 'MeetingRoomController@delete');
        Route::post('/update-status', 'MeetingRoomController@updateStatus');

    });

    Route::prefix('/bookings')->group(function() {

        Route::post('/get', 'BookingController@get');
        Route::post('/save', 'BookingController@save');
        Route::post('/update', 'BookingController@update');
        Route::post('/delete', 'BookingController@delete');
        Route::post('/update-status', 'BookingController@updateStatus');

        Route::get('/{id}/success', 'BookingController@success');

    });

    Route::prefix('/clients')->group(function() {

        Route::post('/lookup', 'UserController@lookup');        

    });

});





