<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFarewellMessagesTable extends Migration
{
    public function up()
    {
        Schema::create('farewell_messages', function (Blueprint $table) {
            $table->id();
            $table->string('message');
            $table->boolean('active')->default(1); // <--- Add this line
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('farewell_messages');
    }
}
