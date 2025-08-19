
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
        console.log(res.status);
        localStorage.removeItem('token');
        alert("Error");
        alert(res.status);
        alert(res.body.whitelist);
        window.location.href = '/login.html';
        alert("Error");
      }
    }

    checkAccess();

    document.getElementById('logout-btn').addEventListener('click', async () => {
      await auth.signOut();
      localStorage.removeItem('token');
      window.location.href = '/login.html';
    });