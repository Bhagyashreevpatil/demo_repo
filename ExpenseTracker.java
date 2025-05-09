package backend;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;

public class ExpenseTracker {
    private static JSONArray expenses = new JSONArray();

    public static void main(String[] args) {
        try (ServerSocket serverSocket = new ServerSocket(8080)) {
            System.out.println("Server is running on port 8080...");

            while (true) {
                Socket clientSocket = serverSocket.accept();
                BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
                PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true);

                String line;
                String requestMethod = null;
                while (!(line = in.readLine()).isEmpty()) {
                    if (requestMethod == null) {
                        requestMethod = line.split(" ")[0];
                    }
                    System.out.println(line);
                }

                // Handle OPTIONS request for CORS
                if ("OPTIONS".equalsIgnoreCase(requestMethod)) {
                    out.println("HTTP/1.1 200 OK");
                    out.println("Access-Control-Allow-Origin: *");
                    out.println("Access-Control-Allow-Methods: POST, GET, OPTIONS");
                    out.println("Access-Control-Allow-Headers: Content-Type");
                    out.println("Content-Type: application/json");
                    out.println();
                    continue;
                }

                // Handle POST request
                StringBuilder requestBody = new StringBuilder();
                while (in.ready()) {
                    requestBody.append((char) in.read());
                }
                // Handle POST request
                if ("POST".equalsIgnoreCase(requestMethod) && requestBody.length() > 0) {
                    JSONObject expense = new JSONObject(requestBody.toString());
                    expenses.put(expense);
                    System.out.println("Added expense: " + expense.toString());

                    // CORS headers for POST
                    out.println("HTTP/1.1 200 OK");
                    out.println("Access-Control-Allow-Origin: *");
                    out.println("Content-Type: application/json");
                    out.println();
                }

                // Handle GET request
                if ("GET".equalsIgnoreCase(requestMethod)) {
                    out.println("HTTP/1.1 200 OK");
                    out.println("Access-Control-Allow-Origin: *");
                    out.println("Content-Type: application/json");
                    out.println();
                    out.println(expenses.toString());
                    System.out.println("Sent expenses: " + expenses.toString());
                }

                clientSocket.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
