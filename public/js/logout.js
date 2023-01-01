const logout = () => {
  $.ajax({
    url: '/logout',
    method: 'GET',
    success: function (data) {
      window.location.href = '/login';
    },
    error: function (err) {
      console.log(err);
    }
  });
}