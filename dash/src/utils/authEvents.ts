const authEventTarget = new EventTarget();

function onAuthInvalid(callback: () => void) {
    authEventTarget.addEventListener("authInvalid", callback);
    return () => authEventTarget.removeEventListener("authInvalid", callback);
}

function emitAuthInvalid() {
    authEventTarget.dispatchEvent(new Event("authInvalid"));
}

export {onAuthInvalid, emitAuthInvalid}