function NotReceived () {
    if (input.runningTime() - receive_last_time > 2500) {
        return 1
    } else {
        return 0
    }
}
function OutputLog () {
    basic.showLeds(`
        . # # # .
        . # # # .
        # # # # #
        . # # # .
        . . # . .
        `)
    serial.redirectToUSB()
    currnet_time = input.runningTime()
    number_of_data = contact_ID.length - 1
    for (let index = 0; index <= number_of_data; index++) {
        serial.writeLine("" + Math.round((currnet_time - contact_time[index]) / 1000) + "," + contact_ID[index])
    }
    basic.clearScreen()
}
input.onButtonPressed(Button.A, function () {
    DisplayScore()
})
function SendID () {
    led.toggle(2, 2)
    radio.sendString(control.deviceName())
    basic.pause(900 + randint(0, 200))
}
function AddLog (ID: string) {
    if (contact_ID.length > 100) {
        dummy_string = contact_ID.shift()
        dummy_int = contact_time.shift()
    }
    contact_ID.push(ID)
    contact_time.push(input.runningTime())
}
function BonusScore () {
    if (input.runningTime() - last_time_bonus >= bonus_time) {
        score += 1
        last_time_bonus = input.runningTime()
        basic.showLeds(`
            . . # . .
            . # # # .
            # # # # #
            . # # # .
            . # # # .
            `)
        basic.pause(500)
        basic.clearScreen()
    }
}
input.onButtonPressed(Button.AB, function () {
    OutputLog()
})
radio.onReceivedString(function (receivedString) {
    SetAlertLevel(receivedString)
})
input.onButtonPressed(Button.B, function () {
    DisplayMyID()
})
function DisplayScore () {
    basic.clearScreen()
    basic.showNumber(score)
    basic.clearScreen()
}
function Initialize () {
    score = 10
    bonus_time = 3600000
    music.setVolume(95)
    radio.setGroup(19)
    radio.setTransmitPower(0)
    contact_ID = []
    contact_time = []
    alert_level = 0
    last_time_bonus = input.runningTime()
    receive_start_time = 0
    receive_last_time = 0
}
function DisplayMyID () {
    basic.clearScreen()
    basic.showString(control.deviceName())
    basic.clearScreen()
}
function SetAlertLevel (ID: string) {
    receive_last_time = input.runningTime()
    if (receive_start_time == 0) {
        receive_start_time = input.runningTime()
    }
    duration = input.runningTime() - receive_start_time
    if (duration >= 5000) {
        alert_level = 3
        AddLog(ID)
        score += -1
    } else if (duration >= 2000) {
        alert_level = 2
    } else {
        alert_level = 1
    }
    basic.pause(1000)
}
function ShowAlert () {
    if (NotReceived()) {
        alert_level = 0
        receive_start_time = 0
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            `)
    }
    if (alert_level == 1) {
        basic.showLeds(`
            . . . . .
            . . # . .
            . # # # .
            . . # . .
            . . . . .
            `)
        music.playTone(1000, music.beat(BeatFraction.Sixteenth))
        basic.pause(500)
    } else if (alert_level == 2) {
        basic.showLeds(`
            . . # . .
            . # # # .
            # # # # #
            . # # # .
            . . # . .
            `)
        music.playTone(2000, music.beat(BeatFraction.Sixteenth))
    } else if (alert_level == 3) {
        basic.showLeds(`
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            `)
        music.startMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once)
        basic.pause(2000)
    }
}
let duration = 0
let receive_start_time = 0
let alert_level = 0
let score = 0
let bonus_time = 0
let last_time_bonus = 0
let dummy_int = 0
let dummy_string = ""
let contact_time: number[] = []
let contact_ID: string[] = []
let number_of_data = 0
let currnet_time = 0
let receive_last_time = 0
Initialize()
basic.forever(function () {
    SendID()
})
basic.forever(function () {
    ShowAlert()
})
