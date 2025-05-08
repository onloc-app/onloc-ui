import { Device, Location, Setting, User } from "./types/types"

let ip = ""
if (process.env.REACT_APP_API_IP) {
  ip = process.env.REACT_APP_API_IP
}

export async function getStatus() {
  try {
    console.log(ip)
    const response = await fetch(`${ip}/api/status`)

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

export async function userInfo(token: string) {
  try {
    const response = await fetch(`${ip}/api/user`, {
      method: "GET",
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
    if (!error.status) {
      console.log(error)
      return { message: error.message, error: true }
    }
    return error
  }
}

export async function login(username: string, password: string) {
  try {
    const response = await fetch(`${ip}/api/login`, {
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
    const response = await fetch(`${ip}/api/register`, {
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
    const response = await fetch(`${ip}/api/logout`, {
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

export async function patchUser(token: string, user: User) {
  try {
    const response = await fetch(`${ip}/api/user`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
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

export async function getSessions(token: string) {
  try {
    const response = await fetch(`${ip}/api/user/tokens`, {
      method: "GET",
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

export async function deleteSession(token: string, id: number) {
  try {
    const response = await fetch(`${ip}/api/user/tokens/${id}`, {
      method: "DELETE",
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

export async function getDevices(token: string) {
  try {
    const response = await fetch(`${ip}/api/devices`, {
      method: "GET",
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

export async function postDevice(token: string, device: Device) {
  try {
    const response = await fetch(`${ip}/api/devices`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: device.name,
        icon: device.icon,
      }),
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

export async function deleteDevice(token: string, id: number) {
  try {
    const response = await fetch(`${ip}/api/devices/${id}`, {
      method: "DELETE",
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

export async function getSettings(token: string) {
  try {
    const response = await fetch(`${ip}/api/settings`, {
      method: "GET",
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

export async function postSetting(token: string, setting: Setting) {
  try {
    const response = await fetch(`${ip}/api/settings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: setting.key,
        value: setting.value,
      }),
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

export async function patchSetting(token: string, setting: Setting) {
  try {
    const response = await fetch(`${ip}/api/settings/${setting.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: setting.key,
        value: setting.value,
      }),
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

export async function getLocationsByDeviceId(token: string, deviceId: number) {
  try {
    const response = await fetch(`${ip}/api/locations?device_id=${deviceId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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
