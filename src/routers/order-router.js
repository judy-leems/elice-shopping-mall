import { Router } from 'express';
import is from '@sindresorhus/is';
import { orderService } from '../services';
import { loginRequired } from '../middlewares';

const orderRouter = Router();

// 주문 생성
orderRouter.post('/', loginRequired, async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요',
      );
    }
    // 주문 안에 상품이 여러개일 경우, products를 배열로 받아온다.
    // products = [{shortId, quantity}]
    const {
      ordererName,
      phoneNumber,
      shortTitle,
      orderStatus,
      address,
      products,
      deliveryRequest,
      deliveryFee,
      totalPrice,
    } = req.body;

    const userId = req.currentUserId;

    const orderInfo = {
      ordererName,
      phoneNumber,
      shortTitle,
      orderStatus,
      address,
      products,
      deliveryRequest,
      deliveryFee,
      totalPrice,
      userId,
    };

    // 위 데이터를 주문 db에 추가하기
    const newOrder = await orderService.addOrderInfo(orderInfo);

    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});

// 사용자 주문 전체 조회
orderRouter.get('/', loginRequired, async function (req, res, next) {
  try {
    const userId = req.currentUserId;
    const orders = await orderService.getOrdersByUserId(userId);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
});

// 사용자의 특정 주문 상세 조회
orderRouter.get('/:shortId', loginRequired, async function (req, res, next) {
  try {
    const shortId = req.params.shortId;
    const orderInfo = await orderService.getOrderInfo(shortId);
    res.status(200).json(orderInfo);
  } catch (error) {
    next(error);
  }
});

// 주문 삭제
orderRouter.delete('/:shortId', loginRequired, async (req, res, next) => {
  try {
    const shortId = req.params.shortId;
    const deletedOrder = await orderService.deleteOrder(shortId);
    res.status(200).json(deletedOrder);
  } catch (error) {
    next(error);
  }
});

export { orderRouter };
