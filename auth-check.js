
    firebase.initializeApp(window.firebaseConfig);

    const auth = firebase.auth();

    async function checkAccess() {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login.html';
        return;
      }

      const res = await fetch('/.netlify/functions/verify-user', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status !== 200 && window.location.hostname !== 'localhost') {
        localStorage.removeItem('token');
        window.location.href = '/login.html';
      }
    }

    checkAccess();

    document.getElementById('logout-btn').addEventListener('click', async () => {
      await auth.signOut();
      localStorage.removeItem('token');
      window.location.href = '/login.html';
    });