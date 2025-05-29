package scalars

import (
	"fmt"
	"io"
)

type PlayerStatus string

const (
	OFFLINE          PlayerStatus = "OFFLINE" // 1
	ONLINE           PlayerStatus = "ONLINE"  // 2
	AWAY             PlayerStatus = "AWAY"    // 3
	SNOOZE           PlayerStatus = "SNOOZE"  // 4...
	LOOKING_TO_TRADE PlayerStatus = "LOOKING_TO_TRADE"
	LOOKING_TO_PLAY  PlayerStatus = "LOOKING_TO_PLAY"
	UNKNOWN          PlayerStatus = "UNKNOWN" // 7 (not specified)
)

// transform type interface{} to a valid state ('offline', 'online'...)
func (s *PlayerStatus) UnmarshalGQL(v interface{}) error {
	status, ok := v.(int)

	if !ok {
		*s = UNKNOWN
		return fmt.Errorf("playerstatus should be a number")
	}

	switch status {
	case 1:
		*s = OFFLINE
	case 2:
		*s = ONLINE
	case 3:
		*s = AWAY
	case 4:
		*s = SNOOZE
	case 5:
		*s = LOOKING_TO_TRADE
	case 6:
		*s = LOOKING_TO_PLAY
	default:
		*s = UNKNOWN
	}

	return nil
}

// transforms the state into valid json type
func (s PlayerStatus) MarshalGQL(w io.Writer) {
	w.Write([]byte(s))
}
