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
            lower.contains("facebook") -> "facebook"
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
        val usageStatsManager =
            context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val daysArray: WritableArray = Arguments.createArray()

        for (i in 0 until 7) {
            // Calculate start and end of day (i days ago)
            val calendar = Calendar.getInstance().apply {
                add(Calendar.DAY_OF_YEAR, -i)
                set(Calendar.HOUR_OF_DAY, 0)
                set(Calendar.MINUTE, 0)
                set(Calendar.SECOND, 0)
                set(Calendar.MILLISECOND, 0)
            }
            val startTime = calendar.timeInMillis
            calendar.apply {
                set(Calendar.HOUR_OF_DAY, 23)
                set(Calendar.MINUTE, 59)
                set(Calendar.SECOND, 59)
                set(Calendar.MILLISECOND, 999)
            }
            val endTime = calendar.timeInMillis

            // Query usage stats and process apps usage
            val aggregatedOriginal = usageStatsManager.queryAndAggregateUsageStats(startTime, endTime)
            var totalScreenTime = 0L
            val appsArray: WritableArray = Arguments.createArray()
            for ((pkg, usage) in aggregatedOriginal) {
                totalScreenTime += usage.totalTimeInForeground
                if (usage.totalTimeInForeground > 0) {
                    val appMap = Arguments.createMap()
                    // Map package name to friendly social app name if applicable.
                    appMap.putString("name", mapToSocialAppName(pkg))
                    appMap.putDouble("screenTime", usage.totalTimeInForeground.toDouble())
                    appsArray.pushMap(appMap)
                }
            }

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
