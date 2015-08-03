using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using LanLordlAPIs.Classes.Crypto;
using LanLordlAPIs.Models.db_Model;

namespace LanLordlAPIs.Classes.Utility
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


        public static bool saveLandlordIp(Guid LandlorId, string IP)
        {
            try
            {
                using (NOOCHEntities obj = new NOOCHEntities())
                {
                    var lanlorddetails =
                        (from c in obj.Landlords

                         where c.LandlordId == LandlorId
                         select
                             c
                     ).FirstOrDefault();

                    if (lanlorddetails == null) return false;
                    if (!String.IsNullOrEmpty(lanlorddetails.IpAddresses))
                    {
                        string IPsListPrepared = "";
                        //trying to split and see how many old ips we have
                        string[] recenips = lanlorddetails.IpAddresses.Split(',');
                        if (recenips.Length >= 5)
                        {
                            for (int i = 0; i < 4; i++)
                            {
                                if (i == 0)
                                {
                                    IPsListPrepared = recenips[i];
                                }
                                else if (i == 4)
                                {
                                    IPsListPrepared = IPsListPrepared + ", " + recenips[i];
                                    break;

                                }
                                else
                                {
                                    IPsListPrepared = IPsListPrepared + ", " + recenips[i];
                                }

                            }

                            IPsListPrepared = IPsListPrepared + ", " + IP;
                        }
                        else
                        {
                            IPsListPrepared = lanlorddetails.IpAddresses + ", " + IP;
                        }

                        //updating ip in db

                        lanlorddetails.IpAddresses = IPsListPrepared;
                        obj.SaveChanges();
                        return true;

                    }
                    return false;
                }


            }
            catch (Exception ex)
            {
                Logger.Error("Landlords API -> CommonHelper -> saveLandlordIp. Error while updating IP address - [ " + IP + " ] for Landlor Id [ " + LandlorId + " ]. Error details [" + ex + " ]");
                return false;
            }

        }

        public static string GenerateAccessToken()
        {
            byte[] time = BitConverter.GetBytes(DateTime.UtcNow.ToBinary());
            byte[] key = Guid.NewGuid().ToByteArray();
            string token = Convert.ToBase64String(time.Concat(key).ToArray());
            return CommonHelper.GetEncryptedData(token);
        }
    }
}