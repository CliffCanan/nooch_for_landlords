using lanlords_web_services.Classes.Crypto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace lanlords_web_services.Classes.Utility
{
    public class CommonHelper
    {
        public static string GetEncryptedData(string sourceData)
        {
            try
            {
                var aesAlgorithm = new AES();
                string encryptedData = aesAlgorithm.Encrypt(sourceData, string.Empty);
                return encryptedData.Replace(" ", "+");
            }
            catch (Exception ex)
            {

            }
            return string.Empty;
        }
        public static string UppercaseFirst(string s)
        {
            // Check for empty string.
            if (string.IsNullOrEmpty(s))
            {
                return string.Empty;
            }
            // Return char and concat substring.
            return char.ToUpper(s[0]) + s.Substring(1);
        }

        public static string GetDecryptedData(string sourceData)
        {
            try
            {
                var aesAlgorithm = new AES();
                string decryptedData = aesAlgorithm.Decrypt(sourceData.Replace(" ", "+"), string.Empty);
                return decryptedData;
            }
            catch (Exception ex)
            {
            }
            return string.Empty;
        }


       
    }
}