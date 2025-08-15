firebase.initializeApp(window.firebaseConfig);
    const auth = firebase.auth();

    document.getElementById('login-btn').addEventListener('click', async () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      try {
        const result = await auth.signInWithPopup(provider);
        const email = result.user.email;

        if (email.endsWith('@oakhill.nsw.edu.au')) { //ADD ! LATER
          alert('Access denied: Use your school email.');
          await auth.signOut();
          return;
        }

        const token = await result.user.getIdToken();
        localStorage.setItem('token', token);
        window.location.href = '/';
      } catch (err) {
        console.error(err);
      }
    });