module Main exposing (main)

import Browser
import Html exposing (Html, div, h1, text)
import Html.Attributes exposing (style)

main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }

type alias Model =
    { message : String
    }

init : () -> (Model, Cmd Msg)
init _ =
    ( { message = "Hello from Elm in Astro!" }, Cmd.none )

type Msg
    = NoOp

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

view : Model -> Html Msg
view model =
    div [ style "padding" "20px", style "background-color" "#f0f0f0", style "border-radius" "8px" ]
        [ h1 [ style "color" "#1293D8" ] [ text model.message ]
        ]