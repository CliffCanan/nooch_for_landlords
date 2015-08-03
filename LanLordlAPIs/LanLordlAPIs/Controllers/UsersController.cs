using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using LanLordlAPIs.Classes.Utility;
using LanLordlAPIs.Models.db_Model;
using LanLordlAPIs.Models.Input_Models;
using LanLordlAPIs.Models.Output_Models;

namespace LanLordlAPIs.Controllers
{
    public class UsersController : ApiController
    {
        [HttpPost]
        [ActionName("Login")]
        public LoginResult Login(LoginInput User)
        {
            LoginResult result = new LoginResult();
            try
            {


                using (NOOCHEntities obj = new NOOCHEntities())
                {

                    DateTime requestDatetime = DateTime.Now;


                    if (String.IsNullOrEmpty(User.Ip) || String.IsNullOrEmpty(User.UserName) ||
                        String.IsNullOrEmpty(User.Password))
                    {
                        result.IsSuccess = false;
                        result.ErrorMessage = "Invalid login information provided.";
                        return result;
                    }


                    Logger.Info("Landlords API -> Users -> Login. Login requested by [" + User.UserName + "]");

                    #region All authentication code in this block

                    string passEncrypted = CommonHelper.GetEncryptedData(User.Password);
                    string userNameEncrypted = CommonHelper.GetEncryptedData(User.UserName);

                    // checking if username and password is correct and given user is landlord or not
                    var userCheckResult = (from c in obj.Landlords
                                           join d in obj.Members on c.MemberId equals d.MemberId
                                           where d.UserName == userNameEncrypted && d.Password == passEncrypted
                                                 && d.IsDeleted == false && c.IsDeleted == false && c.Status == "Active"
                                           select
                                               new
                                               {
                                                   c.LandlordId,
                                                   c.IpAddresses,
                                                   c.MemberId
                                               }
                        ).FirstOrDefault();

                    if (userCheckResult != null)
                    {
                        //updating ip in db
                        var landlordEntity =
                            (from ll in obj.Landlords where ll.LandlordId == userCheckResult.LandlordId select ll)
                                .FirstOrDefault();

                        CommonHelper.saveLandlordIp(userCheckResult.LandlordId, User.Ip);
                        landlordEntity.DateModified = requestDatetime;

                        landlordEntity.WebAccessToken = CommonHelper.GenerateAccessToken();

                        obj.SaveChanges();


                        result.IsSuccess = true;
                        result.ErrorMessage = "OK";
                        result.AccessToken = landlordEntity.WebAccessToken;
                        result.MemberId = landlordEntity.MemberId.ToString();

                    }
                    else
                    {
                        result.IsSuccess = false;
                        result.ErrorMessage = "Invalid Username password or Member not active.";
                        return result;
                    }

                    #endregion


                    return result;
                }
            }

            catch (Exception ex)
            {
                Logger.Error("Landlords API -> Users -> Login. Error while login request from username  - [ " + User.UserName + " ] . Exception details [ " + ex + " ]");
                result.IsSuccess = false;
                result.ErrorMessage = "Error while logging on. Retry.";
                return result;

            }


        }
    }
}
