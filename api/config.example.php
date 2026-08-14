<?php
/**
 * Analytics configuration.
 * Copy this file to config.php and change the secret key.
 */

return [
    // Secret key for viewing stats at stats.html – change this!
    'secret_key' => 'avm-stats-2026-change-me',

    // Max visits to keep in storage (older entries are trimmed)
    'max_visits' => 10000,

    // Path to analytics data file (relative to project root)
    'data_file' => __DIR__ . '/../data/analytics.json',
];
