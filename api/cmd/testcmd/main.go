package main

import (
	"fmt"
	"murky_api/internal/constants"
	"time"
)

func main() {
	loc, err := time.LoadLocation("Europe/Tallinn")
	if err != nil {
		fmt.Println(err)
		return
	}
	year, month, day := time.Now().In(loc).Date()
	tomorrowUtc := time.Date(year, month, day, 0, 0, 0, 0, loc).AddDate(0, 0, 1).UTC()

	fmt.Println(tomorrowUtc.Format(constants.SqliteDateTimeFormat))
}
