const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
}

export const api={
  session:()=>request("/auth/session"),
  register:(body)=>request("/auth/register",{method:"POST",body:JSON.stringify(body)}),
  login:(body)=>request("/auth/login",{method:"POST",body:JSON.stringify(body)}),
  forgotPassword:(email)=>request("/auth/forgot-password",{method:"POST",body:JSON.stringify({email})}),
  resetPassword:(body)=>request("/auth/reset-password",{method:"POST",body:JSON.stringify(body)}),
  logout:()=>request("/auth/logout",{method:"POST"}),
  circles:()=>request("/circles"),
  createCircle:(name)=>request("/circles",{method:"POST",body:JSON.stringify({name})}),
  invite:(id,body)=>request(`/circles/${id}/invitations`,{method:"POST",body:JSON.stringify(body)}),
  pendingInvites:()=>request("/circles/invitations/pending"),
  acceptInvite:(id,memberId)=>request(`/circles/${id}/invitations/${memberId}/accept`,{method:"POST"}),
  permissions:(id,memberId,body)=>request(`/circles/${id}/members/${memberId}/permissions`,{method:"PATCH",body:JSON.stringify(body)}),
  approvals:()=>request("/approvals/pending"),
  myApprovals:()=>request("/approvals/mine"),
  requestApproval:(body)=>request("/approvals",{method:"POST",body:JSON.stringify(body)}),
  decide:(id,decision)=>request(`/approvals/${id}/decision`,{method:"POST",body:JSON.stringify({decision})}),
  createOrder:(approvalId)=>request("/paypal/orders",{method:"POST",body:JSON.stringify({approvalId})}),
  capture:(id)=>request(`/paypal/orders/${id}/capture`,{method:"POST"}),
  wallet:()=>request('/wallet'),
  walletTransactions:()=>request('/wallet/transactions'),
  walletSend:(body)=>request('/wallet/send',{method:'POST',headers:{'Idempotency-Key':crypto.randomUUID()},body:JSON.stringify(body)}),
  walletAdminCredit:(body,key)=>request('/wallet/admin/credit',{method:'POST',headers:{'x-wallet-admin-key':key},body:JSON.stringify(body)}),
  paypalConfig:()=>request('/wallet/paypal-config'),
  walletTopup:(amount)=>request('/wallet/sandbox-topups',{method:'POST',body:JSON.stringify({amount})}),
  walletTopupCapture:(id)=>request(`/wallet/sandbox-topups/${encodeURIComponent(id)}/capture`,{method:'POST'}),
  settings:()=>request('/settings'),
  updateProfile:(body)=>request('/settings/profile',{method:'PATCH',body:JSON.stringify(body)}),
  updatePreferences:(body)=>request('/settings/preferences',{method:'PATCH',body:JSON.stringify(body)}),
  changePassword:(body)=>request('/settings/password',{method:'POST',body:JSON.stringify(body)}),
  sessions:()=>request('/settings/sessions'),
  revokeSession:(id)=>request(`/settings/sessions/${id}`,{method:'DELETE'})
};
