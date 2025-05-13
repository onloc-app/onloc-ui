import { API_URL } from "./../config"

export async function getStatus() {
  try {
    console.log(API_URL)
    const response = await fetch(`${API_URL}/status`)

    const data = await response.json()

    if (!response.ok) {
      throw { status: response.status, message: data.message, error: true }
    }

    return data
  } catch (error: any) {
    console.error(error)
    if (!error.status) {
      console.log(error)
      return { message: error.message, error: true }
    }
    return error
  }
}

export async function login(username: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw { status: response.status, message: data.message, error: true }
    }

    return data
  } catch (error: any) {
    console.error(error)
    if (!error.status) {
      console.log(error)
      return { message: error.message, error: true }
    }
    return error
  }
}

export async function register(
  username: string,
  password: string,
  passwordConfirmation: string
) {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        password_confirmation: passwordConfirmation,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw { status: response.status, message: data.message, error: true }
    }

    return data
  } catch (error: any) {
    console.error(error)
    if (!error.status) {
      console.log(error)
      return { message: error.message, error: true }
    }
    return error
  }
}

export async function logout(token: string) {
  try {
    const response = await fetch(`${API_URL}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw { status: response.status, message: data.message, error: true }
    }

    return data
  } catch (error: any) {
    console.error(error)
    return error
  }
}
