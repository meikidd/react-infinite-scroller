import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { stub, spy } from 'sinon';
import { InfiniteScroll } from '../src/InfiniteScroll';

describe('InfiniteScroll component', () => {
  it('should render', () => {
    const loadMore = stub();
    const children = (
      <div>
        <div className="child-class">1</div>
        <div className="child-class">2</div>
        <div className="child-class">3</div>
      </div>
    );

    const wrapper = mount(
      <div>
        <InfiniteScroll pageStart={0} loadMore={loadMore} hasMore={false}>
          <div className="om-product__list">{children}</div>
        </InfiniteScroll>
      </div>
    );
    expect(wrapper.find('.child-class').length).to.equal(3);
  });

  it('should render componentDidMount', () => {
    spy(InfiniteScroll.prototype, 'componentDidMount');
    const loadMore = stub();
    const children = (
      <div>
        <div className="child-class">1</div>
        <div className="child-class">2</div>
        <div className="child-class">3</div>
      </div>
    );
    mount(
      <div>
        <InfiniteScroll pageStart={0} loadMore={loadMore} hasMore={false}>
          <div className="om-product__list">{children}</div>
        </InfiniteScroll>
      </div>
    );
    expect(InfiniteScroll.prototype.componentDidMount.callCount).to.equal(1);
    InfiniteScroll.prototype.componentDidMount.restore();
  });

  it('should attach scroll listeners', () => {
    spy(InfiniteScroll.prototype, 'attachScrollListener');
    spy(InfiniteScroll.prototype, 'scrollListener');
    const loadMore = stub();
    const children = (
      <div>
        <div className="child-class">1</div>
        <div className="child-class">2</div>
        <div className="child-class">3</div>
      </div>
    );
    mount(
      <div>
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore
          useWindow={false}
          threshold={0}
        >
          <div className="om-product__list">{children}</div>
        </InfiniteScroll>
      </div>
    );
    expect(InfiniteScroll.prototype.attachScrollListener.callCount).to.equal(1);
    expect(InfiniteScroll.prototype.scrollListener.callCount).to.equal(1);
    InfiniteScroll.prototype.attachScrollListener.restore();
    InfiniteScroll.prototype.scrollListener.restore();
  });

  it('should handle when the scrollElement is removed from the DOM', () => {
    const loadMore = stub();

    const wrapper = mount(
      <div>
        <InfiniteScroll pageStart={0} loadMore={loadMore} hasMore={false}>
          <div className="child-component">Child Text</div>
        </InfiniteScroll>
      </div>
    );

    const component = wrapper.find(InfiniteScroll);

    // The component has now mounted, but the scrollComponent is null
    component.instance().scrollComponent = null;

    // Invoke the scroll listener which depends on the scrollComponent to
    // verify it executes properly, and safely navigates when the
    // scrollComponent is null.
    component.instance().scrollListener();

    expect(wrapper.text()).to.contain('Child Text');
  });
});
