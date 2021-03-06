import {Location} from './Location'

export class World {

    private LocationsWithAliveCells: Location[] = []

    public addLivingCellAt(location: Location) {
        this.LocationsWithAliveCells.push(location)
    }

    public addLivingCellsAt(locations: Location[]) {
        locations.forEach((location) => this.addLivingCellAt(location))
    }

    public getAliveCellsLocations(): Location[] {
        return this.LocationsWithAliveCells
    }

    public isThereALivingCellAt(location: Location): boolean {
        return this.LocationsWithAliveCells
                        .find((aliveCell) =>
                            aliveCell.x === location.x &&
                            aliveCell.y === location.y) !== undefined
    }

    public willCellSurvive(neighboursCount: number): boolean {
        return neighboursCount === 2 ||
               neighboursCount === 3
    }

    public tick(): void {
        const nextAliveCellsLocations: Location[] = []
        // this.LocationsWithAliveCells.forEach((location: Location) => {
        //     const aliveNeigboursCount = this.getAliveNeighborsForLocation(location).length
        //     if (this.willCellSurvive(aliveNeigboursCount)) {
        //         nextAliveCellsLocations.push(location)
        //     }
        // })
        // this.LocationsWithAliveCells = nextAliveCellsLocations

        const potentiallyAlive: Location[] = []
        this.LocationsWithAliveCells.forEach((location: Location) => {
            const neighbors = location.getNeighbors()
            potentiallyAlive.push(...neighbors)
        })

        const aliveNeighborCount = potentiallyAlive.reduce( (accumulator: any, current: Location) => {
            const key = `${current.x}, ${current.y}`
            accumulator[key] = accumulator[key] ? accumulator[key] + 1 : 1
            return accumulator
        }, {})

        const willSurvive = this.LocationsWithAliveCells.reduce( (accumulator: any, current: Location) => {
            const count = aliveNeighborCount[`${current.x}, ${current.y}`]
            if (count === 2 || count === 3) {
                accumulator.push(current)
            }
            return accumulator
        }, [])

        const willResurrect = potentiallyAlive.reduce( (accumulator: any, current: Location) => {
            const count = aliveNeighborCount[`${current.x}, ${current.y}`]
            if (count === 3) {
                accumulator.push(current)
            }
            return accumulator
        }, [])

        this.LocationsWithAliveCells = willSurvive.concat(willResurrect)
    }

    public getAliveNeighborsForLocation(aLocation: Location): Location[] {
        return aLocation.getNeighbors().filter((location) => this.isThereALivingCellAt(location))
    }
}
