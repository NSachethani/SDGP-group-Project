package com.wolfwiz12.pauseplus

import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.app.usage.UsageStats
import android.content.Context
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableArray
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

object ScreenTimeService {
    private fun mapToSocialAppName(pkg: String): String {
        val lower = pkg.toLowerCase()
        return when {
            lower.contains("facebook.katana") -> "facebook"
            lower.contains("instagram") -> "instagram"
            lower.contains("whatsapp") -> "whatsapp"
            lower.contains("youtube") -> "youtube"
            lower.contains("zhiliaoapp") -> "tiktok"
            lower.contains("tiktok.lite") -> "tiktok_lite"
            lower.contains("snapchat") -> "snapchat"
            lower.contains("twitter") -> "twitter"
            lower.contains("linkedin") -> "linkedin"
            lower.contains("pinterest") -> "pinterest"
            lower.contains("telegram") -> "telegram"
            lower.contains("reddit") -> "reddit"
            lower.contains("tencent") -> "wechat"
            lower.contains("tinder") -> "tinder"
            lower.contains("discord") -> "discord"
            else -> pkg
        }
    }

    fun getUsageData(context: Context): WritableMap {
        val MAX_DAILY_MS = 86400000L
        val usageStatsManager =
            context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val daysArray: WritableArray = Arguments.createArray()

        for (i in 0 until 7) {
            // Compute accurate local day boundaries based on the device's local time
            val baseCalendar = Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, 0)
                set(Calendar.MINUTE, 0)
                set(Calendar.SECOND, 0)
                set(Calendar.MILLISECOND, 0)
            }
            val startCalendar = (baseCalendar.clone() as Calendar).apply {
                add(Calendar.DAY_OF_YEAR, -i)
            }
            val endCalendar = (startCalendar.clone() as Calendar).apply {
                set(Calendar.HOUR_OF_DAY, 23)
                set(Calendar.MINUTE, 59)
                set(Calendar.SECOND, 59)
                set(Calendar.MILLISECOND, 999)
            }
            val startTime = startCalendar.timeInMillis
            val endTime = endCalendar.timeInMillis

            // Replace aggregatedOriginal call with INTERVAL_DAILY based query:
            val usageStatsList = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY, startTime, endTime
            )
            // Filter stats to include only those that actually belong to the current day
            val filteredStatsList = usageStatsList.filter { it.lastTimeUsed in startTime..endTime }
            val aggregatedOriginal = mutableMapOf<String, Long>()
            filteredStatsList.forEach { stats ->
                aggregatedOriginal[stats.packageName] =
                    (aggregatedOriginal[stats.packageName] ?: 0L) + stats.totalTimeInForeground
            }

            var totalScreenTime = 0L
            val appsArray: WritableArray = Arguments.createArray()
            for ((pkg, usageTimeRaw) in aggregatedOriginal) {
                // Optionally clamp individual app usage if needed:
                val usageTime = if (usageTimeRaw > MAX_DAILY_MS) MAX_DAILY_MS else usageTimeRaw
                totalScreenTime += usageTime
                if (usageTime > 0) {
                    val appMap = Arguments.createMap()
                    appMap.putString("name", mapToSocialAppName(pkg))
                    appMap.putDouble("screenTime", usageTime.toDouble())
                    appsArray.pushMap(appMap)
                }
            }
            
            // Cap the total screen time to MAX_DAILY_MS (24 hours)
            if (totalScreenTime > MAX_DAILY_MS) totalScreenTime = MAX_DAILY_MS

            // Count unlock events
            var unlocks = 0
            val events = usageStatsManager.queryEvents(startTime, endTime)
            val event = UsageEvents.Event()
            while (events.hasNextEvent()) {
                events.getNextEvent(event)
                if (event.eventType == UsageEvents.Event.KEYGUARD_HIDDEN) {
                    unlocks++
                }
            }

            // Build day map
            val dayMap = Arguments.createMap()
            val dayLabel = SimpleDateFormat("EEE", Locale.getDefault()).format(startTime)
            dayMap.putString("date", dayLabel)
            dayMap.putDouble("totalScreenTime", totalScreenTime.toDouble())
            dayMap.putInt("unlocks", unlocks)
            dayMap.putArray("apps", appsArray)
            daysArray.pushMap(dayMap)
        }
        val result = Arguments.createMap()
        result.putArray("days", daysArray)
        return result
    }
}
