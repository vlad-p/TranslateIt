<?php
// die();
error_reporting(0);

require_once '../inc/AccessTokenAuthentication.class.php';
require_once '../inc/HTTPTranslator.class.php';

try {
     //Client ID of the application.
    $clientID     = "vladp";
    //Client Secret key of the application.
    $clientSecret = "FqM+zm22a8sVs6SCPsxLu/LDf28q8kmTHAeF24v2CFg=";
    //OAuth Url.
    $authUrl      = "https://datamarket.accesscontrol.windows.net/v2/OAuth2-13/";
    //Application Scope Url
    $scopeUrl     = "http://api.microsofttranslator.com";
    //Application grant type
    $grantType    = "client_credentials";

    //Create the AccessTokenAuthentication object.
    $authObj      = new AccessTokenAuthentication();
    //Get the Access token.
    $accessToken  = $authObj->getTokens($grantType, $scopeUrl, $clientID, $clientSecret, $authUrl);
    //Create the authorization Header string.
    $authHeader = "Authorization: Bearer ". $accessToken;

    //Create the Translator Object.
    $translatorObj = new HTTPTranslator($authHeader);

    $translations =
        $translatorObj->getTranslations($_GET['languageFrom'], $_GET['languageTo'], $_GET['textToTranslate'], $_GET['maxTranslations']);
    
    header("Content-Type: text/javascript; charset=utf-8");
    echo $_GET['callback'] . '(' . $translations . ');';

    die();

    //Set the Params.
    $inputStr        = "hot";
    $fromLanguage   = "en";
    $toLanguage        = "ru";
    $user            = 'TestUser';
    $category       = "general";
    $uri             = null;
    $contentType    = "text/plain";
    $maxTranslation = 5;

    //Create the string for passing the values through GET method.
    $params = "from=$fromLanguage".
                "&to=$toLanguage".
                "&maxTranslations=$maxTranslation".
                "&text=".urlencode($inputStr).
                "&user=$user".
                "&uri=$uri".
                "&contentType=$contentType";

    //HTTP getTranslationsMethod URL.
    $getTranslationUrl = "http://api.microsofttranslator.com/V2/Ajax.svc/GetTranslations?$params";

    //Create the Translator Object.
    $translatorObj = new HTTPTranslator();

    //Call the curlRequest.
    $curlResponse = $translatorObj->curlRequest($getTranslationUrl, $authHeader);
    // header("Content-Type: application/json; charset=utf-8");
    echo $_GET['callback'] . '(' . $curlResponse . ');';
    die();
    error_reporting(E_ALL);
    print_r(json_decode($curlResponse, false, 512, JSON_BIGINT_AS_STRING));
   switch (json_last_error()) {
        case JSON_ERROR_NONE:
            echo ' - No errors';
        break;
        case JSON_ERROR_DEPTH:
            echo ' - Maximum stack depth exceeded';
        break;
        case JSON_ERROR_STATE_MISMATCH:
            echo ' - Underflow or the modes mismatch';
        break;
        case JSON_ERROR_CTRL_CHAR:
            echo ' - Unexpected control character found';
        break;
        case JSON_ERROR_SYNTAX:
            echo ' - Syntax error, malformed JSON';
        break;
        case JSON_ERROR_UTF8:
            echo ' - Malformed UTF-8 characters, possibly incorrectly encoded';
        break;
        default:
            echo ' - Unknown error';
        break;
    }

    die();
    //Interprets a string of XML into an object.
    $xmlObj = simplexml_load_string($curlResponse);
    $translationObj = $xmlObj->Translations;
    $translationMatchArr = $translationObj->TranslationMatch;
    echo "Get Translation For <b>$inputStr</b>";
    echo "<table border ='2px'>";
    echo "<tr><td><b>Count</b></td><td><b>MatchDegree</b></td>
        <td><b>Rating</b></td><td><b>TranslatedText</b></td></tr>";
    foreach($translationMatchArr as $translationMatch) {
        echo "<tr><td>$translationMatch->Count</td><td>$translationMatch->MatchDegree</td><td>$translationMatch->Rating</td>
            <td>$translationMatch->TranslatedText</td></tr>";
    }
    echo "</table></br>";
} catch (Exception $e) {
    echo "Exception: " . $e->getMessage() . PHP_EOL;
}
