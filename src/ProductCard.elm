port module ProductCard exposing (main)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onMouseEnter, onMouseLeave)
import Json.Decode as Decode exposing (Decoder, Value)


-- PORTS

-- Receive toggle view commands from JavaScript
port toggleInsideView : (() -> msg) -> Sub msg


-- TYPES

type alias Color =
    { id : String
    , name : String
    , hexCode : String
    , svgUrl : String
    , inStock : Bool
    }

type alias Product =
    { id : String
    , name : String
    , price : Float
    , currency : String
    , imageSrc : String
    , description : Maybe String
    , isNew : Bool
    , hasRFID : Bool
    , colors : List Color
    }

type ImageView
    = NormalView
    | InsideView

type alias Model =
    { product : Product
    , selectedColorId : String
    , imageView : ImageView
    , isHovering : Bool
    }


-- INIT

init : Value -> ( Model, Cmd Msg )
init flags =
    case Decode.decodeValue decodeFlags flags of
        Ok { product } ->
            let
                -- Select first available color by default
                firstColorId =
                    product.colors
                        |> List.filter .inStock
                        |> List.head
                        |> Maybe.map .id
                        |> Maybe.withDefault ""
            in
            ( { product = product
              , selectedColorId = firstColorId
              , imageView = NormalView
              , isHovering = False
              }
            , Cmd.none
            )

        Err _ ->
            -- Fallback for decoding errors
            ( { product =
                    { id = "error"
                    , name = "Product"
                    , price = 0
                    , currency = "USD"
                    , imageSrc = ""
                    , description = Nothing
                    , isNew = False
                    , hasRFID = False
                    , colors = []
                    }
              , selectedColorId = ""
              , imageView = NormalView
              , isHovering = False
              }
            , Cmd.none
            )


-- UPDATE

type Msg
    = SelectColor String
    | ToggleImageView
    | MouseEnter
    | MouseLeave
    | ReceiveToggleView ()

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SelectColor colorId ->
            ( { model | selectedColorId = colorId }
            , Cmd.none
            )
            
        ToggleImageView ->
            ( { model | imageView = switchImageView model.imageView }
            , Cmd.none
            )
            
        MouseEnter ->
            ( { model | isHovering = True }
            , Cmd.none
            )
            
        MouseLeave ->
            ( { model | isHovering = False }
            , Cmd.none
            )
            
        ReceiveToggleView _ ->
            ( { model | imageView = switchImageView model.imageView }
            , Cmd.none
            )

switchImageView : ImageView -> ImageView
switchImageView currentView =
    case currentView of
        NormalView ->
            InsideView
            
        InsideView ->
            NormalView


-- VIEW

view : Model -> Html Msg
view model =
    div [ class "product-card" ]
        [ viewImage model
        , viewInfo model
        ]

viewImage : Model -> Html Msg
viewImage model =
    let
        -- Get image based on selected color
        image = 
            if model.selectedColorId /= "" then
                model.product.colors
                    |> List.filter (\c -> c.id == model.selectedColorId)
                    |> List.head
                    |> Maybe.map .svgUrl
                    |> Maybe.withDefault model.product.imageSrc
            else
                model.product.imageSrc
                
        -- Button text changes based on image view state
        buttonText =
            case model.imageView of
                NormalView ->
                    "SHOW INSIDE "
                
                InsideView ->
                    "SHOW OUTSIDE "
                    
        buttonIcon =
            case model.imageView of
                NormalView ->
                    "+"
                
                InsideView ->
                    "-"
    in
    div 
        [ class "product-card__image-container"
        , onMouseEnter MouseEnter
        , onMouseLeave MouseLeave
        ] 
        [ button 
            [ class "product-card__show-inside-btn"
            , classList [ ("product-card__show-inside-btn--visible", model.isHovering) ]
            , onClick ToggleImageView
            ]
            [ text buttonText
            , span [ class "plus-icon" ] [ text buttonIcon ]
            ]
        , a 
            [ href ("/products/" ++ model.product.id)
            , class "product-card__image-link"
            ] 
            [ img 
                [ src image
                , alt model.product.name
                , class "product-card__image"
                ] 
                []
            , if model.product.isNew then
                div [ class "product-card__badge product-card__badge--new" ] 
                    [ text "New" ]
              else
                text ""
            ]
        ]

viewInfo : Model -> Html Msg
viewInfo model =
    div [ class "product-card__info" ]
        [ h3 [ class "product-card__name" ]
            [ a 
                [ href ("/products/" ++ model.product.id)
                , class "product-card__name-link"
                ]
                [ text model.product.name
                , if model.product.hasRFID then
                    span [] [ text " – RFID safe" ]
                  else
                    text ""
                ]
            ]
        , div [ class "product-card__price-container" ]
            [ div [ class "product-card__price" ]
                [ text (formatPrice model.product.price model.product.currency) ]
            ]
        , viewColors model
        , case model.product.description of
            Just desc ->
                div [ class "product-card__description" ] [ text desc ]
            
            Nothing ->
                text ""
        ]

viewColors : Model -> Html Msg
viewColors model =
    div [ class "product-card__colors" ]
        (List.map (viewColor model.selectedColorId) model.product.colors)

viewColor : String -> Color -> Html Msg
viewColor selectedId color =
    let
        isSelected = selectedId == color.id
        
        outOfStockClass =
            if not color.inStock then
                "product-card__color-option--out-of-stock"
            else
                ""

        selectedClass =
            if isSelected then
                "product-card__color-option--selected"
            else
                ""
    in
    button
        [ class "product-card__color-option"
        , class outOfStockClass
        , class selectedClass
        , style "background-color" color.hexCode
        , disabled (not color.inStock)
        , onClick (SelectColor color.id)
        , title color.name
        , attribute "aria-label" (color.name ++ " color" ++ 
                if not color.inStock then
                    " (out of stock)"
                else
                    "")
        ]
        [ span [ class "sr-only" ] [ text color.name ] ]


-- HELPERS

formatPrice : Float -> String -> String
formatPrice price currency =
    let
        formattedPrice =
            String.fromFloat price
                |> (\str ->
                        if String.contains "." str then
                            -- Make sure we have exactly 2 decimal places
                            let
                                parts = String.split "." str
                                intPart = Maybe.withDefault "" (List.head parts)
                                decPart = List.drop 1 parts |> List.head |> Maybe.withDefault ""
                                paddedDecPart = 
                                    if String.length decPart == 0 then
                                        "00"
                                    else if String.length decPart == 1 then
                                        decPart ++ "0"
                                    else
                                        String.left 2 decPart
                            in
                            intPart ++ "." ++ paddedDecPart
                        else
                            str ++ ".00"
                   )
    in
    if currency == "USD" || currency == "AUD" then
        "$" ++ formattedPrice
    else if currency == "EUR" then
        "€" ++ formattedPrice
    else if currency == "GBP" then
        "£" ++ formattedPrice
    else
        currency ++ " " ++ formattedPrice


-- JSON DECODERS

decodeFlags : Decoder { product : Product }
decodeFlags =
    Decode.map (\p -> { product = p })
        (Decode.field "product" decodeProduct)

decodeProduct : Decoder Product
decodeProduct =
    Decode.succeed Product
        |> decodeField "id" Decode.string
        |> decodeField "name" Decode.string
        |> decodeField "price" Decode.float
        |> decodeField "currency" Decode.string
        |> decodeField "imageSrc" Decode.string
        |> decodeOptionalField "description" (Decode.nullable Decode.string)
        |> decodeField "isNew" Decode.bool
        |> decodeField "hasRFID" Decode.bool
        |> decodeField "colors" (Decode.list decodeColor)

decodeColor : Decoder Color
decodeColor =
    Decode.succeed Color
        |> decodeField "id" Decode.string
        |> decodeField "name" Decode.string
        |> decodeField "hexCode" Decode.string
        |> decodeField "svgUrl" Decode.string
        |> decodeField "inStock" Decode.bool

-- Helper for required field decoding
decodeField : String -> Decoder a -> Decoder (a -> b) -> Decoder b
decodeField field decoder partial =
    Decode.map2 (\f v -> f v)
        partial
        (Decode.field field decoder)

-- Helper for optional field decoding
decodeOptionalField : String -> Decoder a -> Decoder (a -> b) -> Decoder b
decodeOptionalField field decoder partial =
    Decode.map2 (\f v -> f v)
        partial
        (Decode.oneOf
            [ Decode.field field decoder
            , Decode.succeed Nothing
            ]
        )


-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions _ =
    toggleInsideView ReceiveToggleView


-- MAIN

main : Program Value Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }