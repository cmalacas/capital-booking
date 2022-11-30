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

    Route::get('/dashboard', function () {
        return view('welcome');
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

});





