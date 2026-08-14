<?php
/**
 * Analytics stats endpoint – returns aggregated visit data (requires secret key).
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$configFile = __DIR__ . '/config.php';
if (!file_exists($configFile)) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'Analytics not configured']);
    exit;
}

$config = require $configFile;
$key = $_GET['key'] ?? '';

if ($key === '' || !hash_equals($config['secret_key'], $key)) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Unauthorized']);
    exit;
}

$dataFile = $config['data_file'];
$visits = [];

if (file_exists($dataFile)) {
    $raw = json_decode(file_get_contents($dataFile), true);
    if (is_array($raw) && isset($raw['visits'])) {
        $visits = $raw['visits'];
    }
}

$now = time();
$todayStart = strtotime('today');
$weekStart = strtotime('-7 days');

$totalVisits = count($visits);
$sessions = [];
$pages = [];
$referrers = [];
$sources = [];
$searchQueries = [];
$devices = [];
$daily = [];
$recent = [];

foreach ($visits as $v) {
    $ts = (int) ($v['ts'] ?? 0);
    $sessionId = $v['sessionId'] ?? '';
    $page = $v['page'] ?? '(unknown)';
    $source = $v['source'] ?? 'direct';
    $referrer = $v['referrer'] ?? '';
    $searchQuery = trim($v['searchQuery'] ?? '');
    $device = $v['device'] ?? 'unknown';

    if ($sessionId !== '') {
        $sessions[$sessionId] = true;
    }

    $pages[$page] = ($pages[$page] ?? 0) + 1;
    $sources[$source] = ($sources[$source] ?? 0) + 1;
    $devices[$device] = ($devices[$device] ?? 0) + 1;

    if ($referrer !== '' && $referrer !== 'direct') {
        $host = parse_url($referrer, PHP_URL_HOST) ?: $referrer;
        $referrers[$host] = ($referrers[$host] ?? 0) + 1;
    }

    if ($searchQuery !== '') {
        $searchQueries[$searchQuery] = ($searchQueries[$searchQuery] ?? 0) + 1;
    }

    $day = date('Y-m-d', $ts);
    $daily[$day] = ($daily[$day] ?? 0) + 1;
}

krsort($daily);
$dailyLast30 = array_slice($daily, 0, 30, true);

arsort($pages);
arsort($referrers);
arsort($sources);
arsort($searchQueries);
arsort($devices);

$recentVisits = array_slice(array_reverse($visits), 0, 50);

$visitsToday = 0;
$visitsThisWeek = 0;
foreach ($visits as $v) {
    $ts = (int) ($v['ts'] ?? 0);
    if ($ts >= $todayStart) {
        $visitsToday++;
    }
    if ($ts >= $weekStart) {
        $visitsThisWeek++;
    }
}

function topN(array $map, int $n): array {
    $out = [];
    $i = 0;
    foreach ($map as $label => $count) {
        $out[] = ['label' => $label, 'count' => $count];
        $i++;
        if ($i >= $n) {
            break;
        }
    }
    return $out;
}

echo json_encode([
    'ok' => true,
    'generatedAt' => $now,
    'summary' => [
        'totalVisits' => $totalVisits,
        'uniqueSessions' => count($sessions),
        'visitsToday' => $visitsToday,
        'visitsThisWeek' => $visitsThisWeek,
        'searchVisits' => ($sources['google'] ?? 0) + ($sources['bing'] ?? 0) + ($sources['duckduckgo'] ?? 0) + ($sources['yahoo'] ?? 0),
    ],
    'topPages' => topN($pages, 15),
    'topReferrers' => topN($referrers, 10),
    'topSources' => topN($sources, 10),
    'topSearchQueries' => topN($searchQueries, 15),
    'devices' => topN($devices, 5),
    'dailyLast30' => $dailyLast30,
    'recentVisits' => $recentVisits,
], JSON_UNESCAPED_UNICODE);
