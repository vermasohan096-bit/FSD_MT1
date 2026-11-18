
const express = require('express');

const app = express();

app.use(express.json());

const PORT = 3000;

// Initial data
let registrations = [
    {
        id: 501,
        participantName: "Riya Sharma",
        eventName: "Tech Fest",
        department: "CSE",
        ticketCount: 2,
        paymentStatus: "Paid"
    },
    {
        id: 502,
        participantName: "Arjun Mehta",
        eventName: "Code Sprint",
        department: "IT",
        ticketCount: 1,
        paymentStatus: "Pending"
    },
    {
        id: 503,
        participantName: "Neha Verma",
        eventName: "Tech Fest",
        department: "ECE",
        ticketCount: 3,
        paymentStatus: "Paid"
    }
];

// 1. GET all registrations
app.get('/api/registrations', (req, res) => {
    res.status(200).json(registrations);
});

// 2. POST new registration
app.post('/api/registrations', (req, res) => {

    const {
        participantName,
        eventName,
        department,
        ticketCount,
        paymentStatus
    } = req.body;

    if (
        typeof participantName !== 'string' || !participantName.trim() ||
        typeof eventName !== 'string' || !eventName.trim() ||
        typeof department !== 'string' || !department.trim() ||
        !Number.isInteger(ticketCount) || ticketCount <= 0 ||
        !['Paid', 'Pending'].includes(paymentStatus)
    ) {
        return res.status(400).json({
            message: "Invalid input data"
        });
    }

    const newId = Math.max(...registrations.map(r => r.id), 500) + 1;

    const newRegistration = {
        id: newId,
        participantName: participantName.trim(),
        eventName: eventName.trim(),
        department: department.trim(),
        ticketCount,
        paymentStatus
    };

    registrations.push(newRegistration);

    res.status(201).json({
        message: "Registration added successfully",
        registration: newRegistration
    });
});

// 3. Filter by department
app.get('/api/registrations/filter', (req, res) => {

    const department = req.query.department;

    const result = registrations.filter(reg =>
        reg.department.toLowerCase() === department?.toLowerCase()
    );

    res.status(200).json(result);
});

// 4. GET pending registrations
app.get('/api/registrations/pending', (req, res) => {

    const result = registrations.filter(reg =>
        reg.paymentStatus === 'Pending'
    );

    res.status(200).json(result);
});

// 5. GET registration by ID
app.get('/api/registrations/:id', (req, res) => {

    const id = Number(req.params.id);

    const registration = registrations.find(reg =>
        reg.id === id
    );

    if (!registration) {
        return res.status(404).json({
            message: "Registration not found"
        });
    }

    res.status(200).json(registration);
});

// 6. PUT update registration
app.put('/api/registrations/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = registrations.findIndex(reg =>
        reg.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Registration not found"
        });
    }

    const {
        participantName,
        eventName,
        department,
        ticketCount,
        paymentStatus
    } = req.body;

    if (
        typeof participantName !== 'string' || !participantName.trim() ||
        typeof eventName !== 'string' || !eventName.trim() ||
        typeof department !== 'string' || !department.trim() ||
        !Number.isInteger(ticketCount) || ticketCount <= 0 ||
        !['Paid', 'Pending'].includes(paymentStatus)
    ) {
        return res.status(400).json({
            message: "Invalid input data"
        });
    }

    registrations[index] = {
        id,
        participantName: participantName.trim(),
        eventName: eventName.trim(),
        department: department.trim(),
        ticketCount,
        paymentStatus
    };

    res.status(200).json({
        message: "Registration updated successfully",
        registration: registrations[index]
    });
});

// 7. DELETE registration
app.delete('/api/registrations/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = registrations.findIndex(reg =>
        reg.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Registration not found"
        });
    }

    registrations.splice(index, 1);

    res.status(200).json({
        message: "Registration deleted successfully"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

