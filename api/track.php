<?php
/**
 * Visit tracking endpoint – receives pageview beacons from analytics.js
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$configFile = __DIR__ . '/config.php';
if (!file_exists($configFile)) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'Analytics not configured']);
    exit;
}

$config = require $configFile;
$dataFile = $config['data_file'];
$dataDir = dirname($dataFile);

if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

$raw = file_get_contents('php://input');
$payload = json_decode($raw, true);

if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
    exit;
}

$page = isset($payload['page']) ? trim((string) $payload['page']) : '';
if ($page === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Missing page']);
    exit;
}

$visit = [
    'id' => bin2hex(random_bytes(8)),
    'ts' => time(),
    'page' => substr($page, 0, 500),
    'title' => substr((string) ($payload['title'] ?? ''), 0, 200),
    'referrer' => substr((string) ($payload['referrer'] ?? ''), 0, 500),
    'source' => substr((string) ($payload['source'] ?? 'direct'), 0, 50),
    'searchQuery' => substr((string) ($payload['searchQuery'] ?? ''), 0, 200),
    'sessionId' => substr((string) ($payload['sessionId'] ?? ''), 0, 64),
    'device' => substr((string) ($payload['device'] ?? 'unknown'), 0, 20),
    'language' => substr((string) ($payload['language'] ?? ''), 0, 10),
    'isNewSession' => !empty($payload['isNewSession']),
];

$data = ['visits' => []];
if (file_exists($dataFile)) {
    $existing = json_decode(file_get_contents($dataFile), true);
    if (is_array($existing) && isset($existing['visits']) && is_array($existing['visits'])) {
        $data['visits'] = $existing['visits'];
    }
}

$data['visits'][] = $visit;

$max = (int) ($config['max_visits'] ?? 10000);
if (count($data['visits']) > $max) {
    $data['visits'] = array_slice($data['visits'], -$max);
}

file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);

echo json_encode(['ok' => true]);
