<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSagetransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sagetransactions', function (Blueprint $table) {
            $table->id();
            $table->smallInteger('type')->default(0);
            $table->smallInteger('payment_type')->default(0);
            $table->smallInteger('payment_method')->default(0);
            $table->integer('booking_id');
            $table->integer('client_id');
            $table->string('transaction_id')->nullable();
            $table->string('profile_id', 50)->nullable();
            $table->text('offline_notes')->nullable();
            $table->smallInteger('payment_status')->default(0);
            $table->float('amount', 11, 2)->default(0);
            $table->string('VendorTxtCode', 100)->nullable();
            $table->string('VPSTxld', 100)->nullable();
            $table->string('Status', 20)->nullable();
            $table->string('StatusDetail', 100)->nullable();
            $table->string('TxAuthNo', 20)->nullable();
            $table->string('AVSCV2', 100)->nullable();
            $table->string('AddressResult', 100)->nullable();
            $table->string('PostCodeResult', 100)->nullable();
            $table->string('CV2Result', 100)->nullable();
            $table->string('GiftAid', 100)->nullable();
            $table->string('3DSecureStatus', 100)->nullable();
            $table->string('CardType', 20)->nullable();
            $table->string('Last4Digits', 20)->nullable();
            $table->string('DeclineCode', 0)->nullable();
            $table->string('ExpiryDate', 20)->nullable();
            $table->string('BankAuthCode', 50)->nullable();
            $table->text('Crypt')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sagetransactions');
    }
}
