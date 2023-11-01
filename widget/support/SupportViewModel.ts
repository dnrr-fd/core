// @ts-check
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import Accessor from '@arcgis/core/core/Accessor';

interface SupportViewModelParams extends __esri.WidgetProperties {
    serviceURL: string;
    privateKey: string;
    formData: {
        ContactName: string|null,
        EmailAddress: string|null,
        PhoneNumber: string|null,
        Comment: string|null
    };
}
  
@subclass('Support.SupportViewModel')
export default class SupportViewModel extends Accessor {
    constructor(params?: SupportViewModelParams) {
        super(params);
      }
    
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    applicationName!: string;

    @property()
    serviceURL!: string;
  
    @property()
    privateKey!: string;

    @property()
    formData!: {
        ContactName: string|null,
        EmailAddress: string|null,
        PhoneNumber: string|null,
        Comment: string|null
    };


    //--------------------------------------------------------------------------
    //  Public Methods
    //--------------------------------------------------------------------------
    _submitForm(): boolean {
        console.log(`ContactName: ${this.formData.ContactName}`);
        console.log(`EmailAddress: ${this.formData.EmailAddress}`);
        console.log(`PhoneNumber: ${this.formData.PhoneNumber}`);
        console.log(`Comment: ${this.formData.Comment}`);

        // Request the authentication header
        this._getAuthHeader().then(response => {
            if (response === true) {
                const feedbackData = {
                    ContactName: this.formData.ContactName,
                    EmailAddress: this.formData.EmailAddress,
                    PhoneNumber: this.formData.PhoneNumber,
                    Comment: this.formData.Comment
                }

                // Get the authentication token from session storage
                const auth = JSON.parse(sessionStorage.getItem('auth') || '{}');
                const xhttpSend = new XMLHttpRequest();
                xhttpSend.onreadystatechange = function() {
                    if (this.readyState == 4) {
                        alert(`Thank you for contacting us. Your support request will be answered in priority sequence.`);
                    }
                }
                xhttpSend.open("POST", this.serviceURL, true);
                
                if (auth && auth.token) {
                    //Set the authorization header using the authentication token
                    xhttpSend.setRequestHeader('Authorization', 'Bearer ' + auth.token);
                }
                xhttpSend.setRequestHeader('Content-Type', 'application/json');
                xhttpSend.send(JSON.stringify(feedbackData));
            } else {
                throw 'Could not get authorization header!';
            }
        }).catch(error => {
            window.alert(error);
        });

        return true;
    }

    async _getAuthHeader() {
        return new Promise(resolve => {
            const self = this as SupportViewModel;
            const xhr = new XMLHttpRequest();
            xhr.open('GET', this.serviceURL, true);
            xhr.setRequestHeader('api-key', this.privateKey);

            xhr.onload = function () {
                self.applicationName = JSON.parse(xhr.response).appName;
                sessionStorage.setItem('auth', xhr.response);
                // console.log(`Application Name Returned: ${self.applicationName}`);
                resolve(true);
            };

            xhr.onerror = function() {
                const error = 'XHR Returned an Error.';
                console.log(error);
                throw error;
            };
            xhr.send();
        });
    }
}