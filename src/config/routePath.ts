import { basePath, apiV1Path } from '../System/decorators';

export class RoutePath {
	// baseValue for basePath decorator
	public static BASE_PATH = '/';

	// base value for apiV1Path decorator
	public static API_V1_PATH = '/api/v1/';

	@basePath() public static VIEW_LOGIN = 'login';

	@apiV1Path() public static System_Health = 'system/health';
	@apiV1Path() public static System_Logs = 'system/logs';


	@apiV1Path() public static Account = 'accounts';
	@apiV1Path() public static Account_Id = 'accounts/:id';
	@apiV1Path() public static Account_Activate = 'accounts/activate';
	@apiV1Path() public static Account_Activate_Api = 'accounts/activate/api/:activationToken';
	@apiV1Path() public static AccountForgotS1 = 'accounts/forgot/step1';
	@apiV1Path() public static AccountForgotS2 = 'accounts/forgot/step2';

	@apiV1Path() public static Card = 'cards';
	@apiV1Path() public static Card_Id = 'cards/:id';

	@apiV1Path() public static Device = 'devices';
	@apiV1Path() public static Device_Id = 'devices/:id';

	@apiV1Path() public static OfferComment = 'offer_comments';
	@apiV1Path() public static OfferComment_Id = 'offer_comments/:id';

	@apiV1Path() public static Offer = 'promos';
	@apiV1Path() public static Offer_Id = 'promos/:id';
	@apiV1Path() public static Offer_Id_Image = 'promos/:promo_id/image';
	@apiV1Path() public static Offer_Id_Image_Id = 'promos/:promo_id/image/:image_id';

	@apiV1Path() public static Purchase = 'purchases';
	@apiV1Path() public static Purchase_Id = 'purchases/:id';
	@apiV1Path() public static Purchase_Oxxo = 'purchases/oxxo';
	@apiV1Path() public static Purchase_Oxxo_Confirm = 'purchases/oxxo/confirm';
	@apiV1Path() public static Purchase_Deliver = 'purchases/:id/deliver';

	@apiV1Path() public static Store = 'stores';
	@apiV1Path() public static Store_Id = 'stores/:id';
	@apiV1Path() public static Store_Id_Upload_Logo = 'stores/:id/upload_logo';
	@apiV1Path() public static Store_Id_Rate = 'stores/:store_id/rate';

	@apiV1Path() public static Terms_And_Conditions = 'terms_conditions';

	@apiV1Path() public static User = 'users';
	@apiV1Path() public static User_Id = 'users/:id';
	@apiV1Path() public static User_Id_UploadAvatar = 'users/:id/upload_avatar';
	@apiV1Path() public static User_Promo = 'users/promo';
	@apiV1Path() public static User_Promo_Id = 'users/promo/:promoId';

	@apiV1Path() public static StoreReview = 'store_reviews';
	@apiV1Path() public static StoreReview_Id = 'store_reviews/:id';

	@apiV1Path() public static Login = 'login';

	@apiV1Path() public static Logout = 'logout';

	@apiV1Path() public static Whoami = 'whoami';
	@apiV1Path() public static WhoamiCards = 'whoami/cards';
	@apiV1Path() public static WhoamiPurchases = 'whoami/purchases';

	@apiV1Path() public static Reward = 'rewards';
	@apiV1Path() public static Reward_Id = 'rewards/:id';
	@apiV1Path() public static Reward_Id_Claim = 'rewards/:id/claim';
	@apiV1Path() public static Reward_Near_Coords = 'rewards/near/:coordinates';
}
