<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreSetting extends Model
{
    protected $fillable = [
        'delete_tva',
        'delivery_free',
        'delivery_fee',
        'delivery_free_threshold',
    ];

    protected $casts = [
        'delete_tva' => 'boolean',
        'delivery_free' => 'boolean',
        'delivery_fee' => 'decimal:2',
        'delivery_free_threshold' => 'decimal:2',
    ];

    /**
     * Get the single active settings row, creating it with defaults if it doesn't exist.
     */
    public static function getSettings(): self
    {
        return self::firstOrCreate([], [
            'delete_tva' => false,
            'delivery_free' => false,
            'delivery_fee' => 15.00,
            'delivery_free_threshold' => 150.00,
        ]);
    }
}
