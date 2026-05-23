<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StoreSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StoreSettingController extends Controller
{
    /**
     * Show the form for editing the store settings.
     */
    public function edit(): Response
    {
        $settings = StoreSetting::getSettings();

        return Inertia::render('admin/settings', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update the store settings in storage.
     */
    public function update(Request $request): RedirectResponse
    {
        $settings = StoreSetting::getSettings();

        $validated = $request->validate([
            'delete_tva' => 'required|boolean',
            'delivery_free' => 'required|boolean',
            'delivery_fee' => 'required|numeric|min:0',
            'delivery_free_threshold' => 'required|numeric|min:0',
        ]);

        $settings->update($validated);

        return redirect()->back()
            ->with('success', 'Store settings updated successfully.');
    }
}
