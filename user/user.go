package user

type Action string

const (
	ActionIDLE Action = "idle"
)

type User struct {
	Action Action
}
