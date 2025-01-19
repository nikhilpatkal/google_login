import { Component, OnInit } from '@angular/core';

declare var google: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.loadGoogleSignIn();
  }
//this code fully implement the sign up with thte google
  loadGoogleSignIn(): void {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => this.initializeGoogleSignIn();
    document.head.appendChild(script);
  }

  initializeGoogleSignIn(): void {
    const clientId = '630288476869-l7311d4d641iug0lfih7ftsmga45cvn2.apps.googleusercontent.com'; // Replace with your Client ID
    google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: any) => this.handleCredentialResponse(response),
    });

    google.accounts.id.renderButton(
      document.getElementById('google-signin-button')!,
      { theme: 'outline', size: 'large' } // Customize the button
    );
  }
handleCredentialResponse(response: any): void {
  console.log("Google Sign-In successful!", response);

  const token = response.credential; // ID Token
  const decodedToken = jwt_decode(token);

  console.log("Decoded Token:", decodedToken);

  // Fetch additional user info using access token
  fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((userInfo) => {
      console.log("User Info from Google API:", userInfo);

      // Send the combined data to the backend
      const userData = { ...decodedToken, ...userInfo };
      this.saveUserToDatabase(userData);
    })
    .catch((error) => console.error("Error fetching user info:", error));
}

saveUserToDatabase(userData: any): void {
  // Example: Send userData to your backend API
  console.log("Saving User Data to Database:", userData);
}
}
function jwt_decode(token: any): any {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

