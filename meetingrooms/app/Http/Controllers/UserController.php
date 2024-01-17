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

    public function lookup(Request $request) {

        $client = $request->get('client');

        $condition = [];

        $condition[] = "UPPER(firstname) LIKE '%".strtoupper($client)."%'";
        $condition[] = "UPPER(lastname) LIKE '%".strtoupper($client)."%'";
        $condition[] = "UPPER(email) LIKE '%".strtoupper($client)."%'";

        $clients = User::whereRaw(implode(' OR ', $condition))
                    ->where('type', '=', 0)
                    ->get();

        return response()->json(['clients' => $clients], 200, [], JSON_NUMERIC_CHECK);


    }

    public function addClient(Request $request) {

        $firstname = $request->get('firstname');
        $lastname = $request->get('lastname');

        $email = sprintf("%s-%s@email.com", strtolower($firstname), strtolower($lastname));

        $user = new User;

        $user->firstname = $firstname;
        $user->lastname = $lastname;
        $user->type = 0;
        $user->email = $email;
        $user->password = '';
        
        $user->save();

        $data['success'] = 1;
        $data['client_id'] = $user->id;
        $data['clients'] = User::where('type', '=', 0)->get();

        return response()->json($data, 200, [], JSON_NUMERIC_CHECK);


    }
}
