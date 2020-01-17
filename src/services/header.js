const header = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('kinema-token')}`,
    }
    
};

export default header;