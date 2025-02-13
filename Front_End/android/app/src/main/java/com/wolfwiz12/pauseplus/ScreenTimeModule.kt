package com.wolfwiz12.pauseplus

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class ScreenTimeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String = "ScreenTimeModule"

    @ReactMethod
    fun checkAndRequestUsageAccess(promise: Promise) {
        val context = reactApplicationContext
        if (!UsageAccessManager.hasUsageAccess(context)) {
            // In production, actively prompt the user via the current Activity
            val activity = currentActivity
            if (activity != null) {
                UsageAccessManager.requestUsageAccess(activity)
                promise.reject("PermissionError", "Usage Access not granted. Please allow usage access in the settings and try again.")
            } else {
                promise.reject("PermissionError", "Current activity is null. Unable to request permission.")
            }
        } else {
            promise.resolve(true)
        }
    }

    @ReactMethod
    fun getUsageData(promise: Promise) {
        try {
            val data = ScreenTimeService.getUsageData(reactApplicationContext)
            promise.resolve(data)
        } catch (e: Exception) {
            promise.reject("DataError", e)
        }
    }
}
