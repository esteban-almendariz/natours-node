const express = require('express');
const fs = require('fs')

const app = express();

app.use(express.json())

// app.get('/', (req, res) => {
//     res.status(200).json({ message: 'Hello from the server side!', app: 'Natours' })
// })

// app.post('/', (req, res) => {
//     res.send('You can send to this post method')
// })


const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get('/api/v1/tours', (req, res) => {
    res.json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }

    })
});

app.get('/api/v1/tours/:id', (req, res) => {
    console.log(req.params)

    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === req.params)

    if (id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    res.json({
        status: 'success',
        data: {
            tours: tours[id]
        }
    })
})

app.post('/api/v1/tours', (req, res) => {
    // console.log(req.body)
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body)

    tours.push(newTour)

    fs.writeFileSync(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tours: newTour
            }
        })
    })

})

const port = 3000;
app.listen(port, () => {
    console.log('App running on port 3000')
})

