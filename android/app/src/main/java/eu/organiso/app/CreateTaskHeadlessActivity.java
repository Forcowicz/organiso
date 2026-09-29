package eu.organiso.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;

import org.json.JSONObject;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class CreateTaskHeadlessActivity extends Activity {

    private static final String TAG = "OrganisoAndroidAssistant";
    private static final String API_URL = "https://app.organiso.eu/api/tasks";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent = getIntent();
        if (intent != null) {
            String taskName = intent.getStringExtra("task_name");
            if (taskName == null) {
                taskName = intent.getStringExtra(Intent.EXTRA_TEXT);
            }

            String description = intent.getStringExtra("task_description");
            String taskDue = intent.getStringExtra("task_due");

            if (taskName != null && !taskName.trim().isEmpty()) {
                sendTaskToBackend(taskName.trim(), description, taskDue);
            }
        }

        finish();
    }

    private void sendTaskToBackend(String taskName, String description, String taskDue) {
        SharedPreferences prefs = getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        String token = prefs.getString("api_token", null);

        if (token == null) {
            Log.e(TAG, "Missing api_token, the user is not logged in.");
            return;
        }

        // Inteligentne wykrywanie priorytetów z treści komendy
        String lowerName = taskName.toLowerCase();
        boolean isUrgent = lowerName.contains("pilne") || lowerName.contains("urgent");
        boolean isImportant = lowerName.contains("ważne") || lowerName.contains("important");

        new Thread(() -> {
            HttpURLConnection conn = null;
            try {
                URL url = new URL(API_URL);
                conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Authorization", "Bearer " + token);
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setRequestProperty("Accept", "application/json");
                conn.setDoOutput(true);
                conn.setConnectTimeout(5000);
                conn.setReadTimeout(5000);

                JSONObject payload = new JSONObject();
                payload.put("name", taskName);
                if (description != null && !description.trim().isEmpty()) {
                    payload.put("description", description.trim());
                }
                payload.put("is_urgent", isUrgent);
                payload.put("is_important", isImportant);

                // Przekazujemy surowy ciąg daty z Asystenta (Laravel go sparsuje)
                if (taskDue != null && !taskDue.trim().isEmpty()) {
                    payload.put("raw_due", taskDue.trim());
                }

                try (OutputStream os = conn.getOutputStream()) {
                    byte[] input = payload.toString().getBytes(StandardCharsets.UTF_8);
                    os.write(input, 0, input.length);
                }

                int responseCode = conn.getResponseCode();
                Log.d(TAG, "Zadanie wysłane. Kod odpowiedzi HTTP: " + responseCode);

            } catch (Exception e) {
                Log.e(TAG, "An error has occurred when trying to store the task.", e);
            } finally {
                if (conn != null) {
                    conn.disconnect();
                }
            }
        }).start();
    }
}
