<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Sagetransaction extends Model
{
    public function update_transactions($booking_id =null, $payment_details = null, $type = null) {

        if(!empty($payment_details)){

            $saveData = [];
            
            $this->booking_id = $booking_id;
            $this->type = $payment_details->payment_type;
            
            
    		if($type == 'online'){
                
                $data = $payment_details->getData();

                $this->transaction_id = $data['VPSTxId'];
	    		$this->payment_type = 1;
	    		$this->payment_method = 1;
	    		$this->payment_status = (strtolower($data['Status']) == 'ok') ? 2 : 0;
	    		$this->amount = str_replace(',','', $data['Amount']);

                $this->VendorTxCode = $data['VendorTxCode'];
                $this->VPSTxId = $data['VPSTxId'];
                $this->Status = $data['Status'];
                $this->StatusDetail = $data['StatusDetail'];
                $this->TxAuthNo = $data['TxAuthNo'];
                $this->AVSCV2 = $data['AVSCV2'];
                $this->AddressResult = $data['AddressResult'];
                $this->PostCodeResult = $data['PostCodeResult'];
                $this->CV2Result = $data['CV2Result'];
                $this->GiftAid = $data['GiftAid'];
                $this->{'3DSecureStatus'} = $data['3DSecureStatus'];
                $this->CardType = $data['CardType'];
                $this->Last4Digits = $data['Last4Digits'];
                //$this->DeclineCode = $data['DeclineCode'];
                $this->ExpiryDate = isset($data['ExpiryDate']) ? $data['ExpiryDate'] : '1225';
                $this->BankAuthCode = $data['BankAuthCode'];

    		} elseif ($type == 'offline'){

    			$this->payment_type = 0;
    			$this->offline_notes = $data['offline_notes'];
    			$this->payment_status = 2;
    			$this->amount = $data['amount'];

            }
            
            $this->save();
    		
            return $this;
            
    	} else {

    		return false;

    	}
    }
}
