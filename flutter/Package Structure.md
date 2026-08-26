
By Feature: The classes needed for each feature are grouped togheter
- for example: ```auth``` would have ``` auth_viewmodel.dart ``` ``` auth_view.dart ``` ``` login_usecase.dart ```  
By type: Separate forlders repositories, models, services

```
lib/
├── ui/
│   ├── core/
│   │   ├── ui/
│   │   │   └── <shared_widgets>
│   │   └── themes/
│   └── <feature_name>/
│       ├── view_models/
│       │   └── <view_model_class>.dart
│       └── widgets/
│           ├── <feature_name>_screen.dart
│           └── <other_widgets>
├── domain/
│   └── models/
│       └── <model_name>.dart
├── data/
│   ├── repositories/
│   │   └── <repository_class>.dart
│   ├── services/
│   │   └── <service_class>.dart
│   └── model/
│       └── <api_model_class>.dart
├── config/
├── utils/
├── routing/
├── main_staging.dart
├── main_development.dart
└── main.dart

test/         
├── data/
├── domain/
└── ui/
```