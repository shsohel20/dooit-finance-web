const logout = async () => {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
  })
  return res.json();
}

export { logout }