/**
 * Analytics configuration.
 * Tracking works automatically on any page that loads main.js.
 */

export const ANALYTICS = {
  /** Enable/disable all tracking */
  enabled: true,

  /** PHP endpoint (works on XAMPP / Apache with PHP) */
  endpoint: "api/track.php",

  /**
   * Optional: GoatCounter site code (free at https://www.goatcounter.com).
   * Leave empty to skip. Works on static hosts without PHP.
   * Example: "albart-portfolio"
   */
  goatCounter: "",

  /**
   * Optional: Google Analytics 4 Measurement ID.
   * Leave empty to skip. Example: "G-XXXXXXXXXX"
   */
  ga4Id: "",

  /** Session timeout in minutes (new session after inactivity) */
  sessionTimeoutMin: 30,
};
