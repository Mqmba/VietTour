// Tất cả request đến Go backend đều đi qua file này
const BASE_URL = "http://localhost:8080/api/v1"

// Helper gọi API có kèm JWT token tự động
async function request(path, options = {}) {
    const token = localStorage.getItem("token")
    const { headers, ...customOptions } = options

    const res = await fetch(BASE_URL + path, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        ...customOptions,
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Lỗi không xác định")
    return data
}

// Auth
export const authAPI = {
    register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
    login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
    getMe: () => request("/auth/me"),
    updateMe: (body) => request("/auth/me", { method: "PUT", body: JSON.stringify(body) }),
}

// Tours
export const tourAPI = {
    getAll: (params = {}) => {
        const queryString = new URLSearchParams(params).toString()
        return request("/tours" + (queryString ? `?${queryString}` : ""))
    },
    getByID: (id) => request(`/tours/${id}`),
    getBySlug: (slug) => request(`/tours/slug/${slug}`),
    getCategories: () => request("/categories"),
}

// Bookings
export const bookingAPI = {
    create: (body) => request("/bookings", { method: "POST", body: JSON.stringify(body) }),
    getAll: () => request("/bookings"),
    getByID: (id) => request(`/bookings/${id}`),
    cancel: (id, reason) => request(`/bookings/${id}/cancel`, {
        method: "PUT",
        body: JSON.stringify({ reason }),
    }),
}

// Wishlist
export const wishlistAPI = {
    getAll: () => request("/wishlist"),
    add: (id) => request(`/wishlist/${id}`, { method: "POST" }),
    remove: (id) => request(`/wishlist/${id}`, { method: "DELETE" }),
}

// Reviews
export const reviewAPI = {
    create: (body) => request("/reviews", { method: "POST", body: JSON.stringify(body) }),
}