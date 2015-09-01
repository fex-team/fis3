<?php
 
/**
 * PHP implementation of InfoSpaceRequestSigner
 *
 * @see http://sdk.infospace.com/access-keys/#ExampleCode
 *
 */
class InfoSpaceRequestSigner {
    private $token;
 
    /**
     * Constructs the object and saves the token
     *
     * @param string $token
     */
    public function __construct($token) {
        $this->token = $token;
    }

    public function getSignature($queryTerm) {
        $value = $this->getFormattedDateString() . $this->token . $queryTerm;
        return $this->hashValue($value);
    }
 
    /**
     * Gets the date/time to the nearest minute as YYYYMMDDHHMM
     *
     * @return string
     */
    private function getFormattedDateString() {
        // Save the current timezone, get a date as GMT and reset timezone
        $timezone = date_default_timezone_get();
        date_default_timezone_set('GMT');
        $datetime = date('YmdHi', $this->getTimeToNearestMinute());
        date_default_timezone_set($timezone);
 
        return $datetime;
    }
 
    /**
     * Gets the date/time +30 seconds as a unix timestamp
     *
     * @return int
     */
    private function getTimeToNearestMinute() {
        return time() + 30;
    }
 
    /**
     * Gets a base64 encoded SHA1 hash
     *
     * @param string $input
     *
     * @return string
     */
    private function hashValue($input) {
        $bytes = $this->hashSHA1($input);
 
        return $this->encodeUrlSafeBase64($bytes);
    }
 
    /**
     * Gets a SHA1 hash
     *
     * @param string $input
     *
     * @return string
     */
    private function hashSHA1($input) {
        // Trial and error shows this must be binary result
        return sha1($input, true);
    }
 
    /**
     * Creates a URL safe base64 encoded string
     *
     * @param string $input
     *
     * @return string
     */
    private function encodeUrlSafeBase64($input) {
        // Apache code replaces + with -, / with _ and trims padding (=)
        return str_replace(array('+', '/'), array('-', '_'), trim(base64_encode($input), '=='));
    }
}
?>

