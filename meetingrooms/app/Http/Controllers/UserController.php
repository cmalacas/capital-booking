<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\User;

class UserController extends Controller
{
    public function get() {

        $user = User::find(auth()->id());

        return response()->json(['user' => $user], 200, [], JSON_NUMERIC_CHECK);

    }
}
