const timeout = (wait=450) => {
    return new Promise(resolve => setTimeout(resolve, wait));
}

export {
    timeout
}