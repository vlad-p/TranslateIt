<?php
/*
 * Class:HTTPTranslator
 *
 * Processing the translator request.
 */
Class HTTPTranslator {

    private $getTranslationsMethodUrl = "http://api.microsofttranslator.com/V2/Ajax.svc/GetTranslations?";
    private $authHeader;

    function __construct($authHeader)
    {
        $this->authHeader = $authHeader;
    }

    /*
     * Create and execute the HTTP CURL request.
     *
     * @param string $url        HTTP Url.
     * @param string $authHeader Authorization Header string.
     *
     * @return string.
     *
     */
    function curlRequest($url) {
        //Initialize the Curl Session.
        $ch = curl_init();
        //Set the Curl url.
        curl_setopt ($ch, CURLOPT_URL, $url);
        //Set the HTTP HEADER Fields.
        curl_setopt ($ch, CURLOPT_HTTPHEADER, array($this->authHeader,"Content-Type: text/xml", 'Content-Length: 0'));
        //CURLOPT_RETURNTRANSFER- TRUE to return the transfer as a string of the return value of curl_exec().
        curl_setopt ($ch, CURLOPT_RETURNTRANSFER, TRUE);
        //CURLOPT_SSL_VERIFYPEER- Set FALSE to stop cURL from verifying the peer's certificate.
        curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, False);
        //Set HTTP POST Request.
        curl_setopt($ch, CURLOPT_POST, TRUE);
        //Execute the  cURL session.
        $curlResponse = curl_exec($ch);
        //Get the Error Code returned by Curl.
        $curlErrno = curl_errno($ch);
        if ($curlErrno) {
            $curlError = curl_error($ch);
            throw new Exception($curlError);
        }
        //Close a cURL session.
        curl_close($ch);
        return $curlResponse;
    }

    function getTranslations($languageFrom, $languageTo, $textToTranslate, $maxTranslations)
    {
        $queryParams = "from=$languageFrom". "&to=$languageTo". "&maxTranslations=$maxTranslations". "&text=". urlencode($textToTranslate);
        return $this->curlRequest($this->getTranslationsMethodUrl . $queryParams);
    }
}